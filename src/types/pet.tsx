interface Pet {
  id: number,
  userId: number,
  name: string,
  imagePath: string,
  birthday: string,
  speciesId: number,
  breed: string,
  species: {
    icon: string,
    name: string
  }
  events: Array<{
    date: string,
    id: number,
    petId: number,
    title: string,
    description: string,
    imagePath: string,
    categoryId: number,
    category: {
      icon: string,
      name: string
  }
  }>
}

export default Pet;