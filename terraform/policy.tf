resource "aws_iam_policy" "email_service" {
  name        = "${local.environment}-${local.service}"
  description = "Policy for Email Service"

  policy = <<EOF
{
   "Version": "2012-10-17",
   "Statement": [
       {
           "Effect": "Allow",
           "Action": [
               "sqs:ReceiveMessage",
               "sqs:DeleteMessage",
               "sqs:GetQueueAttributes"
           ],
           "Resource": "*"
       }
   ]
}
EOF
}
