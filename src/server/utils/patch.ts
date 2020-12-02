import { TransformOperationExecutor } from "class-transformer/TransformOperationExecutor";
import patch from "patch-method";

patch(
  TransformOperationExecutor,
  "transform",
  (transform, source, value: any, targetType, arrayType, isMap, level = 0) => {
    if (value && typeof value === "object" && typeof value.then === "function") {
      return value;
    }

    return transform(source, value, targetType, arrayType, isMap, level);
  }
);
