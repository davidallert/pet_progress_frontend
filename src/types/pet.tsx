interface Pet {
  id: number,
  user_id: number,
  name: string,
  imagePath: string,
  birthday: string,
  species_id: number,
  breed: string,
  events: Array<{
    date: string,
    id: number,
    petId: number,
    title: string,
    description: string,
    imagePath: string
    type: string,
  }>
}

export default Pet;