export default function UserDetails({ user }) {
  const {
    uid,
    email,
    display_name,
    friends_list,
    friend_requests,
    posts_list,
    display_picture
  } = user;

  return (
    <section>
      <h3>{display_name}</h3>
      <img src={display_picture} alt={display_name} />
    </section>
  )
}