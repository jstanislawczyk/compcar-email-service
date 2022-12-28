resource "aws_ecs_cluster" "main" {
  name = "${local.environment}-main"
}

resource "aws_ecs_task_definition" "email_service" {
  family                   = "${local.environment}-email-service"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  network_mode             = "awsvpc"
  task_role_arn            = aws_iam_role.email_service_ecs_task_role.arn
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

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

resource "aws_ecs_service" "email_service" {
  name             = "${local.environment}-${local.service}"
  cluster          = aws_ecs_cluster.main.id
  task_definition  = aws_ecs_task_definition.email_service.arn
  desired_count    = 1
  launch_type      = "FARGATE"

  network_configuration {
    security_groups  = [aws_security_group.allow_email_service.id]
    subnets          = [aws_subnet.subnet1.id, aws_subnet.subnet2.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.email_service.arn
    container_name   = "${local.environment}-${local.service}"
    container_port   = local.email_service_port
  }
}
