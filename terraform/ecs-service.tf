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

resource "aws_ecs_service" "mailhog" {
  name             = "${local.environment}-${local.service}-mailhog"
  cluster          = aws_ecs_cluster.main.id
  task_definition  = aws_ecs_task_definition.mailhog.arn
  desired_count    = 1
  launch_type      = "FARGATE"

  network_configuration {
    security_groups  = [aws_security_group.allow_email_service.id]
    subnets          = [aws_subnet.subnet1.id, aws_subnet.subnet2.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.mailhog_http.arn
    container_name   = "${local.environment}-mailhog"
    container_port   = local.mailhog_port_http
  }
}
