interface Pet {
  id: number,
  userId: number,
  name: string,
  imagePath: string,
  birthday: string,
  species: string,
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