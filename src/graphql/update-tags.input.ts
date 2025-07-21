// graphql/dto/update-photo-tags.input.ts
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdatePhotoTagsInput {
  @Field()
  id: string;

  @Field(() => [String])
  tags: string[];
}
