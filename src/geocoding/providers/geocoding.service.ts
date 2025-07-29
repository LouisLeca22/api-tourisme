import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';

interface AddressFeature {
  properties: {
    label: string;
    city: string;
    postcode: string;
  };
  geometry: {
    coordinates: [number, number];
  };
}

interface AddressAPIResponse {
  features: AddressFeature[];
}

@Injectable()
export class GeocodingService {
  async lookupAddress(address: string): Promise<{
    address: string;
    city: string;
    postCode: string;
    latitude: number;
    longitude: number;
  }> {
    const response = await axios.get<AddressAPIResponse>(
      'https://api-adresse.data.gouv.fr/search/',
      {
        params: { q: address, limit: 1 },
      },
    );

    const data = response.data;

    if (!data.features || data.features.length === 0) {
      throw new BadRequestException('Adresse introuvable');
    }

    const feature = data.features[0];

    return {
      address: feature.properties.label,
      city: feature.properties.city,
      postCode: feature.properties.postcode,
      latitude: feature.geometry.coordinates[1],
      longitude: feature.geometry.coordinates[0],
    };
  }
}
