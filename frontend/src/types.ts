export type ImageType = {
  id: number
  title?: string
  alt_text?: string
  url: string
}

export type BaseEntity = {
  id: number
  description: string
  created_at: string
  updated_at: string
  images?: ImageType[]
}

export type Room = BaseEntity & {
  room_number: string
  room_type: 'single' | 'double' | 'suite' | 'deluxe'
  room_type_display: string
  price_per_night: string
  capacity: number
  amenities: string
}

export type TableType = BaseEntity & {
  name: string
  seats: number
  price: string
  table_type: '2' | '4' | '8'
}

export type ResortPackage = BaseEntity & {
  title: string
  price: string
  amenities: string
}

export type PlaneClass = BaseEntity & {
  class_name: string
  price: string
  amenities: string
}

export type Occasion = BaseEntity & {
  title: string
  applicable_items: string
}

export type Booking = {
  id: number
  item_type: 'room' | 'table' | 'resort' | 'plane'
  item_id: number
  start_date: string
  end_date: string
  guests: number
  status: string
  notes?: string
  item_name?: string | null
  created_at: string
}

export type DashboardStats = {
  total_rooms: number
  total_resorts: number
  total_bookings: number
  occupancy_rate: number
  recent_bookings: Booking[]
}

export type PaginatedResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

