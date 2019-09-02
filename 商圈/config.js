// const host = 'https://api.ishangmi.cn';
// const host = 'https://web.ishangmi.cn'
 const host = 'http://39.96.161.80:4000';
// const host =  ' http://192.168.101.10:4000'

const Config = {
  //创建商圈
  createQuan: `${host}/businessCircle/create`,



}

const config = () => {
  return Config
};
module.exports = {
  config: config
}
