resource "aws_vpc" "main" {
  cidr_block = "10.0.2.0/24"

  tags = {
    Name = "${local.environment}-${local.service}-vpc"
  }
}
