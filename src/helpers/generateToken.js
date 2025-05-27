import jsw from 'jsonwebtoken'

export const generateToken = ({ dataUser }) => {
  return jsw.sign({
    id: dataUser.id,
    name: dataUser.name,
    email: dataUser.email,
    role: dataUser.role
  }, process.env.JWT_SECRET, {
    expiresIn: '1h',
    noTimestamp: true
  })
}
