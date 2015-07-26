export default {
  get () {
    return JSON.parse(localStorage.getItem('user'))
  },

  set (user) {
    return localStorage.setItem('user', JSON.stringify(user))
  }
}
