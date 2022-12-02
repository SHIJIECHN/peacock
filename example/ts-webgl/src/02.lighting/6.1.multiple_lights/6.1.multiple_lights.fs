#version 300 es
precision highp float;

out FragColor;

// 定向光
struct DirLight{
  vec3 direction;
  
  vec3 ambient;
  vec3 diffuse;
  vec3 specular;
}
uniform DirLight dirLight;

// 点光源
struct PointLight{
  vec3 position;
  
  float constant;
  float linear;
  float quadratic;
  
  vec3 ambient;
  vec3 diffuse;
  vec3 specular;
}
#define NR_POINT_LIGHTS 4
uniform PointLight pointLights[NR_POINT_LIGHTS];

vec3 CalcDirLight(DirLight light,vec3 normal,vec3 viewDir){
  vec3 lightDir=normalize(-light.direction);
  // 漫反射着色
  float diff=max(dot(normal,lightDir),0.);
  // 镜面光着色
  float reflecrDir=reflect(-lightDir,normal);
  float spec=pow(max(dot(viewDir,reflectDir),0.),material.shininess);
  // 合并结果
  vec3 ambient=light.ambient*vec3(texture(material.diffuse,TexCoords));
  vec3 diffuse=light.diffuse*diff*vec3(texture(material.diffuse,TexCoords));
  vec3 specular=light.specular*spec*vec3(texture(material.specular,TexCoords));
  return(ambient+diffuse+specular);
}

void main(){
  // 定义一个输出颜色值
  vec3 output;
  // 将所有的点光源也做相同的事请
  output+=someFunctionToCalculateDirectionalLight();
  // 对所有的点光宇也做相同的事请
  for(int i=0;i<nr_of_point_lights;i++){
    output+=someFunctionToCalculatePointLight();
    // 也加上其他的光源
    output+=someFunctionToCalculateSpoteLight();
    
    FragColor=vec4(output,1.);
  }
}