resource "aws_route_table" "main" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main_gateway.id
  }

  tags = {
    Name = "${local.environment}-route-table"
  }
}

resource "aws_main_route_table_association" "main_route_table" {
  vpc_id         = aws_vpc.main.id
  route_table_id = aws_route_table.main.id
}
