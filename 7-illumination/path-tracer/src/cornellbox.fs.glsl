#version 300 es
precision highp float;

uniform float time;
uniform float width;
uniform float height;
uniform int bounces;
uniform int spp;

in vec2 uv_coord;
out vec4 frag_color;

const float pi = 3.141592653589793238462643383;

// random generates a random uint for a given vec2
// taken from https://www.shadertoy.com/view/Xt3cDn
uint random(uvec2 p) {
    p = 1103515245U*((p >> 1U)^(p.yx));
    uint h32 = 1103515245U*((p.x)^(p.y>>3U));
    return h32^(h32 >> 16);
}

// seed and init_seed are used for random generation, 
// the initialized seed are different depends on the time
float seed = 0.;
void init_seed(vec2 v) {
    seed = float(random(floatBitsToUint(v)))/float(0xffffffffU)+time;
}

// random2 and random3 generate random vec2 or vec3 vectors
vec2 random2() {
    uint n = random(floatBitsToUint(vec2(seed += 0.1, seed += 0.1)));
    return vec2(uvec2(n, n*48271U) & uvec2(0x7fffffffU))/float(0x7fffffff);
}
vec3 random3() {
    uint n = random(floatBitsToUint(vec2(seed += 0.1, seed += 0.1)));
    return vec3(uvec3(n, n*16807U, n*48271U) & uvec3(0x7fffffffU))/float(0x7fffffff);
}

// rotate_y rotates a given point around y-axis by theta.
vec3 rotate_y(const in vec3 p, const in float theta) {
    vec2 xz = mat2(
        cos(theta), sin(theta),
        -sin(theta), cos(theta)
    )*p.xz;
    return vec3(xz.x, p.y, xz.y);
}

struct ray {
    vec3 o, d; // origin and direction
};

// ray_trans translates the origin of a given ray
ray ray_trans(const in ray r, const in vec3 t) {
    ray translated = r;
    translated.o -= t;
    return translated;
}

// ray_rotate_y rorates the origin and direction of a given ray on y-axis
ray ray_rotate_y(const in ray r, const in float t) {
    ray rotated = r;
    rotated.o = rotate_y(rotated.o, t);
    rotated.d = rotate_y(rotated.d, t);
    return rotated;
}

// material defines the type and color of a material
struct material {
    // type is an enum of lambertian and light_source.
    int type;
    // color is the color of the material.
    vec3 color;
};
const int lambertian = 0;
const int light_source = 1;

// red, green, white, and light are the pre-defined materials for the
// creation of cornell box.
const material red = material(
    lambertian, 
    vec3(0.5608, 0.0627, 0.0627)
);
const material green = material(
    lambertian, 
    vec3(0.0588, 0.3961, 0.0863)
);
const material white = material(
    lambertian, 
    vec3(0.5, 0.5, 0.5)
);
const material light = material(
    light_source, 
    vec3(30.0)
);

// hit_record is a record for ray casting.
struct hit_record {
    float t;
    vec3 p, normal;
    material mat;
};

hit_record hit_record_translate(const in hit_record h, const in vec3 t) {
    hit_record hit = h;
    hit.p -= t;
    return hit;
}
   
hit_record hit_record_rotate_y(const in hit_record h, const in float t) {
    hit_record hit = h;
    hit.p = rotate_y(hit.p, t);
    hit.normal = rotate_y(hit.normal, t);
    return hit;
}

struct hitable {
    vec3 center;
    vec3 dimension; // half width and height
};

const float t_min = 0.01;
const float t_max = 10000.0;

// box_intersect determines if a given ray can hit an axis-aligned 
// bounding box. It returns true if intersect and false if not.
bool box_intersect(
    const in hitable box, const in ray r, 
    const in float t_min, const in float t_max,
    out vec3 normal, out float dist) {
    vec3 n = (r.o - box.center) / r.d;
    vec3 k = abs(box.dimension / r.d);
    vec3 t0 = -n - k;
    vec3 t1 = -n + k;

    float t_near = max(max( t0.x, t0.y ), t0.z);
    float t_far = min(min( t1.x, t1.y ), t1.z);
    
    if( t_near > t_far || t_far < 0.0) {
        return false;
    }
    
    float t = t_near < t_min ? t_far : t_near;
    if (t >= t_max || t <= t_min) {
        return false;
    }

    dist = t;
    normal = -sign(r.d) * step(t0.yzx, t0.xyz) * step(t0.zxy, t0.xyz);
    return true;
}

// hitable_hit test if the given ray will hit the given box between t_min
// and t_max, returns true if hit and false if not. The hit record will
// also be recorded.
bool hitable_hit(
    const in hitable box, const in ray r,
    const in float t_min, const in float t_max, 
    inout hit_record hit) {
    float t;
    vec3 normal;

    if (!box_intersect(box, r, t_min, t_max, normal, t)) {
        return false;
    }

    hit.t = t;
    hit.p = r.o + t*r.d;
    hit.normal = normal;
    return true;
}

const float wall_size = 556.0;
const hitable left = hitable(
    vec3(wall_size, wall_size/2.0, wall_size/2.0),
    vec3(1, wall_size/2.0, wall_size/2.0)
);
const hitable right = hitable(
    vec3(0, wall_size/2.0, wall_size/2.0),
    vec3(1, wall_size/2.0, wall_size/2.0)
);
const hitable top = hitable(
    vec3(wall_size/2.0, wall_size, wall_size/2.0), 
    vec3(wall_size/2.0, 1, wall_size/2.0)
);
const hitable bottom = hitable(
    vec3(wall_size/2.0, 0, wall_size/2.0),
    vec3(wall_size/2.0, 1, wall_size/2.0)
);
const hitable back = hitable(
    vec3(wall_size/2.0, wall_size/2.0, wall_size),
    vec3(wall_size/2.0, wall_size/2.0, 1)
);

const float box_size = 165.0;
const hitable l_box = hitable(
    vec3(box_size/2.0, box_size, box_size/2.0), 
    vec3(box_size/2.0, box_size, box_size/2.0)
);
const vec3 l_box_trans = vec3(265, 0, 295);
const float l_box_rotate = 15.0 * pi / 180.0;
const hitable r_box = hitable(
    vec3(box_size/2.0),
    vec3(box_size/2.0)
);
const vec3 r_box_trans = vec3(105.0, 0, 65.0);
const float r_box_rotate = 18.0  * pi / 180.0;


const float area_light_width  = 130.0;
const float area_light_height = 105.0;
const hitable area_light = hitable(
    vec3(wall_size/2.0, wall_size, wall_size/2.0),
    vec3(area_light_width / 2.0, 1, area_light_height / 2.0)
);
const float area_light_surface = area_light_width * area_light_width;
const vec3 area_light_normal = vec3(0.0, -1.0, 0.0);

// world_hit computes a hit record for a given ray. It returns true
// if the given ray hits the world, or return false it not.
// the function also updates the out variable hit from caller.
// Note that this hit function simplies the hit test from a BVH structure.
bool world_hit(const in ray r, out hit_record hit) {
    hit.t = t_max;
    bool ret = false; // hit?

    // ray hits the area light in the cornell box
    if (hitable_hit(area_light, r, t_min, hit.t, hit)) {
        ret = true;
        hit.mat = light;
    }

    // ray hits the right box object of the cornell box
    if (hitable_hit(
        r_box, 
        ray_rotate_y(ray_trans(r, r_box_trans), -r_box_rotate), 
        t_min, hit.t, hit
    )) {
        ret = true;
        hit = hit_record_translate(
            hit_record_rotate_y(hit, r_box_rotate), -r_box_trans);
        hit.mat = white;
    }

    // ray hits the left box object of the cornell box
    if (hitable_hit(
        l_box, 
        ray_rotate_y(ray_trans(r, l_box_trans), l_box_rotate), 
        t_min, hit.t, hit)
    ) {
        ret = true;
        hit = hit_record_translate(
            hit_record_rotate_y(hit, -l_box_rotate), -l_box_trans);
        hit.mat = white;
    }

    // hit the cornell box
    if (hitable_hit(left, r, t_min, hit.t, hit)) {
        ret = true;
        hit.mat = red;
    }
    if (hitable_hit(right, r, t_min, hit.t, hit)) {
        ret = true;
        hit.mat = green;
    }
    if (hitable_hit(top, r, t_min, hit.t, hit) ||
        hitable_hit(bottom, r, t_min, hit.t, hit) ||
        hitable_hit(back, r, t_min, hit.t, hit) ) {
        ret=true;
        hit.mat=white;
    }
    return ret;
}

// shadow_hit tests a given ray is intersected with the two boxes 
// in the cornel box. It returns true if hit or false if don't. This is
// because in the cornell box, there are only two objects can
// cast shadows. A generic implementation should use a BVH.
bool shadow_hit(const in ray r) {
    hit_record hit;

    if (!hitable_hit(
        r_box, ray_rotate_y(ray_trans(r, r_box_trans), -r_box_rotate), t_min, t_max, hit) 
    && !hitable_hit(
        l_box, ray_rotate_y(ray_trans(r, l_box_trans),  l_box_rotate), t_min, t_max, hit)
    )
        return false;

    return true;
}

// sample_wi generates a cosine-weighted random direction
// in a unit hemisphere with given normal n
vec3 sample_wi(const vec3 n) {
    vec2 u = random2();
    vec3  uu = normalize(cross(n, abs(n.y) > .5 ? vec3(1.,0.,0.) : vec3(0.,1.,0.)));
    vec3  vv = cross(uu, n);
    float r = sqrt(u.y);
    float x = r*cos(2.0*pi*u.x); 
    float y = r*sin(2.0*pi*u.x);
    float z = sqrt(1.-u.y);
    return normalize(vec3(x*uu + y*vv + z*n));
}

// shade computes the color of a given ray using path tracing algorithm
vec3 shade(in ray r) {
    vec3 Li = vec3(0);
    vec3 Lo = vec3(0);
    hit_record hit;
    
    // TODO: implement path tracing, return the emitted color of the given ray.
    // Hint: if you understand the path tracing correctly the implementation
    // should be shorter than 30 lines of code.
    for (int i = 0; i < 1+bounces; i++) {


































    }
    return Lo;
}

struct camera {
    vec3 origin, bottom_left, width, height;
};

camera new_camera() {
    camera c;
    float fov = 45.0;
    float aspect = width/height;
    vec3 up = vec3(0, 1, 0);
    float theta = fov*pi/180.0;
    vec3 look_from = vec3(
        wall_size/2.0,
        wall_size/2.0,
        -300.0/(tan(theta/2.0))
    ); // use dolly zoom distance: 1/tan(fov*pi/360)
    vec3 look_at = vec3(wall_size/2.0, wall_size/2.0, 0.0);

    float height_half = tan(theta/2.);
    float width_half = aspect * height_half;
    c.origin = look_from;
    vec3 cam_w = normalize(look_from - look_at);
    vec3 cam_u = normalize(cross(up, cam_w));
    vec3 cam_v = cross(cam_w, cam_u);
    c.bottom_left = c.origin - width_half*cam_u - height_half*cam_v - cam_w;
    c.width = 2.*width_half*cam_u;
    c.height = 2.*height_half*cam_v;
    return c;
}

vec3 ray_generation(camera c, vec2 frag_cood) {
    vec3 Lo = vec3(0);
    for (int i = 0; i < spp; i++) {
        vec2 uv = (frag_cood + random2())/vec2(width, height); // put some noise here
        vec3 d = c.bottom_left + uv.x*c.width + uv.y*c.height - c.origin;
        ray r = ray(c.origin, normalize(d));
        Lo += shade(r);
    }
    return Lo / float(spp);
}

const float gamma = 2.2;
vec3 gamma_correction(vec3 color) {
    float x = pow(color.x, 1.0 / gamma);
    float y = pow(color.y, 1.0 / gamma);
    float z = pow(color.z, 1.0 / gamma);
    return vec3(x, y, z);
}

void main() {
    vec2 frag_cood = uv_coord * vec2(width, height);
    init_seed(frag_cood);
    camera c = new_camera();
    frag_color = vec4(gamma_correction(ray_generation(c, frag_cood)), 1.);
}
