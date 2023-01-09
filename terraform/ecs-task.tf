resource "aws_ecs_task_definition" "email_service" {
  family                   = "${local.environment}-email-service"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  network_mode             = "awsvpc"
  task_role_arn            = aws_iam_role.email_service_ecs_task_role.arn
  execution_role_arn       = aws_iam_role.email_service_ecs_task_execution_role.arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode([
    {
      name         = "${local.environment}-${local.service}"
      image        = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${local.region}.amazonaws.com/${local.environment}:${local.service}"
      essential    = true
      portMappings = [
        {
          containerPort = local.email_service_port
          hostPort      = local.email_service_port
        }
      ]
      environment: [
        { "name": "EMAIL_QUEUE_URL", "value": aws_sqs_queue.emails.id }
      ]
      logConfiguration: {
        logDriver: "awslogs"
        options: {
          awslogs-group: "${local.environment}-${local.service}"
          awslogs-region: local.region
          awslogs-stream-prefix: "ecs"
        }
      }
    },
  ])
}

resource "aws_ecs_task_definition" "mailhog" {
  family                   = "${local.environment}-mailhog"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  network_mode             = "awsvpc"
  task_role_arn            = aws_iam_role.email_service_ecs_task_role.arn
  execution_role_arn       = aws_iam_role.mailhog_ecs_task_execution_role.arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode([
    {
      name         = "${local.environment}-mailhog"
      image        = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${local.region}.amazonaws.com/${local.environment}:mailhog"
      essential    = true
      portMappings = [
        {
          containerPort = local.mailhog_port_http
          hostPort      = local.mailhog_port_http
        },
        {
          containerPort = local.mailhog_port_smtp
          hostPort      = local.mailhog_port_smtp
        }
      ]
      logConfiguration: {
        logDriver: "awslogs"
        options: {
          awslogs-group: "${local.environment}-mailhog"
          awslogs-region: local.region
          awslogs-stream-prefix: "ecs"
        }
      }
    },
  ])
}
