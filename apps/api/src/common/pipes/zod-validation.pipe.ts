import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { ZodType, ZodError } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        const format_error = error.issues.map((issue) => {
          return { path: issue.path, message: issue.message };
        });

        throw new BadRequestException({
          message: "Validation failed",
          errors: format_error,
        });
      }
      throw new BadRequestException("Validation failed");
    }
  }
}
