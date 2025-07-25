import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class Photo {
  @Field(() => ID)
  id: string;

  @Field()
  key: string;

  @Field()
  userId: string;

  @Field(() => [String])
  tags: string[];
}
