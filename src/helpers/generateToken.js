import jsw from 'jsonwebtoken'

export const generateToken = ({ dataUser }) => {
  return jsw.sign({
    user: dataUser.name,
    email: dataUser.email,
    role: dataUser.role.name
  }, process.env.JWT_SECRET, {
    expiresIn: '1h',
    noTimestamp: true
  })
}
