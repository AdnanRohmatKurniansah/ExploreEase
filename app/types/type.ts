export type Params = {
    id: string
}

export type Props = {
    searchParams: {
      page?: string
    }
}

export type User = {
    id: string,
    name: string,
    username: string,
    password: string
    created_at: Date,
    updated_at: Date,
}

export type Categories = {
    id: string
    name: string,
    slug: string,
    description: string,
    icon: string,
    created_at: Date,
    updated_at: Date,
}

export type Destinations = {
    id: string
    name: string,
    slug: string,
    description: string,
    image: string,
    created_at: Date,
    updated_at: Date,
}

export type Facility = {
    id: string
    title: string,
    type: string,
    created_at: Date,
    updated_at: Date,
}

export type Tours = {
    id: string
    title: string,
    image: string,
    description: string,
    highlight: string,
    price: number,
    discount_price?: number | null,
    categoryId: string,
    destinationId: string,
    is_popular: boolean,
    location: string,
    include: string,
    exclude: string,
    created_at: Date,
    updated_at: Date,
    category: {
        name: string
    }
    destination: {
        name: string
    }
}

export type ToursImage = {
    id: string
    title: string,
    tourId: string,
    image: string,
    created_at: Date,
    updated_at: Date,
}

export type ToursItinerary = {
    id: string
    title: string,
    description: string,
    tourId: string,
    image: string,
    created_at: Date,
    updated_at: Date,
}