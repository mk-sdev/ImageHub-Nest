import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TagFilterInput {
  @Field(() => [TagFilterInput], { nullable: true })
  and?: TagFilterInput[];

  @Field(() => [TagFilterInput], { nullable: true })
  or?: TagFilterInput[];

  @Field(() => TagFilterInput, { nullable: true })
  not?: TagFilterInput;

  @Field({ nullable: true })
  tag?: string;
}
