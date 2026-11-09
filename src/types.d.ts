declare module 'virtual:certificates' {
  type Certificate = { src: string; caption: string }
  const certificates: Certificate[]
  export default certificates
}
