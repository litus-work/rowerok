import { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Summit Pro Carbon MTB',
    brand: 'Summit',
    price: 2499,
    category: 'MTB',
    images: [
      'https://images.unsplash.com/photo-1648783531108-7c4f89060dc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGJpa2UlMjBhY3Rpb24lMjBzaG90fGVufDF8fHx8MTc3MDg0NDkzNnww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1752883819721-a369b7b3e469?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiaWN5Y2xlJTIwZGV0YWlsZWQlMjBzdHVkaW8lMjBzaG90fGVufDF8fHx8MTc3MDg0NDkzN3ww&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    specs: {
      frameSize: 'L',
      wheelSize: '29"',
      frameMaterial: 'Carbon',
      brakeType: 'Hydraulic Disc',
      forkType: 'Air Suspension 140mm',
      gears: 12,
      weight: '11.5 kg'
    },
    condition: 'New',
    isAvailable: true,
    isFeatured: true,
    description: 'Dominate the trails with the Summit Pro Carbon. Featuring a lightweight carbon frame and top-tier suspension.',
    rating: 4.8,
    reviewCount: 24
  },
  {
    id: '2',
    name: 'Veloce Road Master',
    brand: 'Veloce',
    price: 3200,
    category: 'Road',
    images: [
      'https://images.unsplash.com/photo-1764067521927-9fc70adc5a31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FkJTIwYmlrZSUyMGN5Y2xpbmclMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcwODQ0OTM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1752883819721-a369b7b3e469?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiaWN5Y2xlJTIwZGV0YWlsZWQlMjBzdHVkaW8lMjBzaG90fGVufDF8fHx8MTc3MDg0NDkzN3ww&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    specs: {
      frameSize: '56cm',
      wheelSize: '700c',
      frameMaterial: 'Carbon',
      brakeType: 'Rim',
      forkType: 'Carbon Rigid',
      gears: 22,
      weight: '7.2 kg'
    },
    condition: 'New',
    isAvailable: true,
    isFeatured: true,
    description: 'Built for speed and aerodynamics. The Veloce Road Master cuts through the wind like a knife.',
    rating: 4.9,
    reviewCount: 45
  },
  {
    id: '3',
    name: 'Terra Gravel Explorer',
    brand: 'Terra',
    price: 1850,
    category: 'Gravel',
    images: [
      'https://images.unsplash.com/photo-1761936316762-d80f2fa85627?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmF2ZWwlMjBiaWtlJTIwbmF0dXJlfGVufDF8fHx8MTc3MDg0NDkzNnww&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    specs: {
      frameSize: 'M',
      wheelSize: '700c',
      frameMaterial: 'Aluminum',
      brakeType: 'Mechanical Disc',
      forkType: 'Carbon Rigid',
      gears: 11,
      weight: '9.8 kg'
    },
    condition: 'New',
    isAvailable: true,
    isFeatured: false,
    description: 'Adventure awaits. The Terra Gravel Explorer handles both tarmac and dirt with ease.',
    rating: 4.7,
    reviewCount: 12
  },
  {
    id: '4',
    name: 'Urban Glide City',
    brand: 'CityLife',
    price: 650,
    category: 'City',
    images: [
      'https://images.unsplash.com/photo-1625090667546-857e3e9a56d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMGNpdHklMjBiaWN5Y2xlJTIwY29tbXV0ZXJ8ZW58MXx8fHwxNzcwODQ0OTM2fDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    specs: {
      frameSize: 'M',
      wheelSize: '28"',
      frameMaterial: 'Steel',
      brakeType: 'V-Brake',
      forkType: 'Rigid',
      gears: 7,
      weight: '14.2 kg'
    },
    condition: 'New',
    isAvailable: true,
    isFeatured: false,
    description: 'Your perfect daily commuter. Reliable, comfortable, and stylish.',
    rating: 4.5,
    reviewCount: 89
  },
  {
    id: '5',
    name: 'Volt E-Ride X',
    brand: 'Volt',
    price: 3500,
    category: 'E-bike',
    images: [
      'https://images.unsplash.com/photo-1736413988047-8086b6592096?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGJpa2UlMjBtb2Rlcm58ZW58MXx8fHwxNzcwODQ0OTM3fDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    specs: {
      frameSize: 'L',
      wheelSize: '29"',
      frameMaterial: 'Aluminum',
      brakeType: 'Hydraulic Disc',
      forkType: 'Air Suspension 120mm',
      gears: 10,
      weight: '22.5 kg'
    },
    condition: 'New',
    isAvailable: true,
    isFeatured: true,
    description: 'Go further with less effort. The Volt E-Ride X features a powerful motor and long-lasting battery.',
    rating: 4.9,
    reviewCount: 15
  },
  {
    id: '6',
    name: 'Junior Racer 24',
    brand: 'KidsWheels',
    price: 350,
    category: 'Kids',
    images: [
      'https://images.unsplash.com/photo-1621194856163-057388f57ba6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwYmljeWNsZSUyMHBhcmt8ZW58MXx8fHwxNzcwODQ0OTM3fDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    specs: {
      frameSize: 'One Size',
      wheelSize: '24"',
      frameMaterial: 'Aluminum',
      brakeType: 'V-Brake',
      forkType: 'Suspension 50mm',
      gears: 7,
      weight: '10.5 kg'
    },
    condition: 'New',
    isAvailable: true,
    isFeatured: false,
    description: 'The perfect first mountain bike for young riders.',
    rating: 4.8,
    reviewCount: 30
  },
  {
    id: '7',
    name: 'Vintage Steel Roadie',
    brand: 'Retro',
    price: 450,
    category: 'Road',
    images: [
      'https://images.unsplash.com/photo-1752883819721-a369b7b3e469?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiaWN5Y2xlJTIwZGV0YWlsZWQlMjBzdHVkaW8lMjBzaG90fGVufDF8fHx8MTc3MDg0NDkzN3ww&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    specs: {
      frameSize: '54cm',
      wheelSize: '700c',
      frameMaterial: 'Steel',
      brakeType: 'Rim',
      forkType: 'Steel Rigid',
      gears: 10,
      weight: '10.2 kg'
    },
    condition: 'Used',
    isAvailable: true,
    isFeatured: false,
    description: 'Classic styling with modern reliability. Fully refurbished.',
    rating: 4.6,
    reviewCount: 5
  },
  {
    id: '8',
    name: 'Trail Blazer Enduro',
    brand: 'Summit',
    price: 3800,
    category: 'MTB',
    images: [
      'https://images.unsplash.com/photo-1648783531108-7c4f89060dc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGJpa2UlMjBhY3Rpb24lMjBzaG90fGVufDF8fHx8MTc3MDg0NDkzNnww&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    specs: {
      frameSize: 'M',
      wheelSize: '27.5"',
      frameMaterial: 'Carbon',
      brakeType: 'Hydraulic Disc',
      forkType: 'Air Suspension 160mm',
      gears: 12,
      weight: '13.8 kg'
    },
    condition: 'New',
    isAvailable: true,
    isFeatured: true,
    description: 'A beast on the downhill. 160mm travel soaks up everything.',
    rating: 5.0,
    reviewCount: 8
  }
];

export const categoryImages: Record<string, string> = {
  'MTB': 'https://images.unsplash.com/photo-1648783531108-7c4f89060dc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGJpa2UlMjBhY3Rpb24lMjBzaG90fGVufDF8fHx8MTc3MDg0NDkzNnww&ixlib=rb-4.1.0&q=80&w=1080',
  'Road': 'https://images.unsplash.com/photo-1764067521927-9fc70adc5a31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FkJTIwYmlrZSUyMGN5Y2xpbmclMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcwODQ0OTM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'Gravel': 'https://images.unsplash.com/photo-1761936316762-d80f2fa85627?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmF2ZWwlMjBiaWtlJTIwbmF0dXJlfGVufDF8fHx8MTc3MDg0NDkzNnww&ixlib=rb-4.1.0&q=80&w=1080',
  'City': 'https://images.unsplash.com/photo-1625090667546-857e3e9a56d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMGNpdHklMjBiaWN5Y2xlJTIwY29tbXV0ZXJ8ZW58MXx8fHwxNzcwODQ0OTM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'Kids': 'https://images.unsplash.com/photo-1621194856163-057388f57ba6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwYmljeWNsZSUyMHBhcmt8ZW58MXx8fHwxNzcwODQ0OTM3fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'E-bike': 'https://images.unsplash.com/photo-1736413988047-8086b6592096?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGJpa2UlMjBtb2Rlcm58ZW58MXx8fHwxNzcwODQ0OTM3fDA&ixlib=rb-4.1.0&q=80&w=1080'
};
