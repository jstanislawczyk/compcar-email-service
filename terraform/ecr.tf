resource "aws_ecr_repository" "main" {
  name                 = "${local.environment}-main"
  image_tag_mutability = "MUTABLE"
}
