resource "aws_cloudwatch_log_group" "email_service" {
  name = "${local.environment}-${local.service}"
}

resource "aws_cloudwatch_log_group" "mailhog" {
  name = "${local.environment}-mailhog"
}
