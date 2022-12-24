locals {
  emails_sqs_name = "${local.environment}-emails"
}


resource "aws_sqs_queue" "emails" {
  name = local.emails_sqs_name

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.emails_dlq.arn
    maxReceiveCount     = 3
  })
}

resource "aws_sqs_queue" "emails_dlq" {
  name = "${local.emails_sqs_name}-dlq"

  redrive_allow_policy = jsonencode({
    redrivePermission = "byQueue",
    sourceQueueArns   = [
      # Required to either hard code or use a local for the name variable to avoid the cycle error.
      "arn:aws:sqs:${local.region}:${data.aws_caller_identity.current.account_id}:${local.emails_sqs_name}",
    ]
  })
}
