import { Injectable } from '@nestjs/common';
import { Photo } from './photo.entity';
import { TagFilterInput } from './tag-filter.input';

@Injectable()
export class PhotoService {
  private photos: Photo[] = [
    { id: '1', userId: '123', url: 'cat.jpg', tags: ['#cat', '#sun'] },
    { id: '2', userId: '123', url: 'dog.jpg', tags: ['#dog'] },
    { id: '3', userId: '123', url: 'cat2.jpg', tags: ['#cat', '#cute'] },
    { id: '4', userId: '456', url: 'sunset.jpg', tags: ['#sun', '#nature'] },
    {
      id: '5',
      userId: '456',
      url: 'mountain.jpg',
      tags: ['#nature', '#hike'],
    },
    { id: '6', userId: '789', url: 'city.jpg', tags: ['#urban', '#night'] },
    { id: '7', userId: '123', url: 'beach.jpg', tags: ['#sun', '#vacation'] },
    { id: '8', userId: '789', url: 'dog2.jpg', tags: ['#dog', '#cute'] },
    { id: '9', userId: '456', url: 'cat3.jpg', tags: ['#cat', '#sleep'] },
    { id: '10', userId: '456', url: 'rain.jpg', tags: ['#weather', '#mood'] },
    {
      id: '11',
      userId: '123',
      url: 'forest.jpg',
      tags: ['#nature', '#green'],
    },
    { id: '12', userId: '789', url: 'bike.jpg', tags: ['#sport', '#urban'] },
    { id: '13', userId: '456', url: 'food.jpg', tags: ['#food', '#yum'] },
    {
      id: '14',
      userId: '123',
      url: 'books.jpg',
      tags: ['#study', '#coffee'],
    },
    { id: '15', userId: '789', url: 'desk.jpg', tags: ['#work', '#setup'] },
    { id: '16', userId: '456', url: 'road.jpg', tags: ['#travel', '#car'] },
    { id: '17', userId: '789', url: 'sky.jpg', tags: ['#sun', '#clouds'] },
    {
      id: '18',
      userId: '123',
      url: 'cat4.jpg',
      tags: ['#cat', '#mood', '#dark'],
    },
    { id: '19', userId: '456', url: 'dog3.jpg', tags: ['#dog', '#happy'] },
    {
      id: '20',
      userId: '123',
      url: 'snow.jpg',
      tags: ['#winter', '#nature'],
    },
  ];

  getAll(): Photo[] {
    return this.photos;
  }

  matchesFilter(photo: Photo, filter?: TagFilterInput): boolean {
    if (!filter) return true;

    if (filter.tag) {
      return photo.tags.includes(filter.tag);
    }

    if (filter.and) {
      return filter.and.every((sub) => this.matchesFilter(photo, sub));
    }

    if (filter.or) {
      return filter.or.some((sub) => this.matchesFilter(photo, sub));
    }

    if (filter.not) {
      return !this.matchesFilter(photo, filter.not);
    }

    return true;
  }

  filterPhotos(userId: string, filter?: TagFilterInput): Photo[] {
    return this.photos.filter(
      (p) => p.userId === userId && this.matchesFilter(p, filter),
    );
  }
}
