resource "aws_ecs_cluster" "main" {
  name = "${local.environment}-main"
}
#
#resource "aws_ecs_task_definition" "email_service" {
#  family                   = "${local.environment}-email-service"
#  requires_compatibilities = ["FARGATE"]
#  cpu                      = 256
#  memory                   = 512
#  network_mode             = "awsvpc"
#  task_role_arn            = aws_iam_role.email_service_ecs_task_role.arn
#  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
#
#  container_definitions = jsonencode([
#    {
#      name      = "first"
#      image     = "service-first"
#      cpu       = 256
#      memory    = 512
#      essential = true
#      portMappings = [
#        {
#          containerPort = 3002
#          hostPort      = 3002
#        }
#      ]
#    },
#  ])
#}

#resource "aws_ecs_service" "email_service" {
#  name            = "${local.environment}-${local.service}"
#  cluster         = aws_ecs_cluster.main.id
#  task_definition = aws_ecs_task_definition.email_service.arn
#  desired_count   = 1
#
#  ordered_placement_strategy {
#    type  = "binpack"
#    field = "cpu"
#  }
#}
