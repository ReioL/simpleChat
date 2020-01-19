import React from "react"

export default React.memo(function Message({ msg, user }) {
  return (
    <>
      {user ? user + ":" : null}
      {msg}
    </>
  )
})
