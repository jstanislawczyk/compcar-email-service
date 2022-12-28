resource "aws_cloudwatch_log_group" "email_service" {
  name = "${local.environment}-${local.service}"
}
