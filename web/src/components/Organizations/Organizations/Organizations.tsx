const Organizations = ( { organizations } ) => {
  return (
    <ul>
      {organizations.map((item) => {
        return <li key={item.id}>{JSON.stringify(item)}</li>
      })}
    </ul>
  )
}

export default Organizations
