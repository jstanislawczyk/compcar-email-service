resource "aws_lb" "app" {
  name            = "${local.environment}-app-lb"
  subnets         = [aws_subnet.subnet1.id, aws_subnet.subnet2.id]
  security_groups = [aws_security_group.allow_email_service.id]
}

resource "aws_lb_target_group" "email_service" {
  name        = "${local.environment}-${local.service}"
  port        = local.email_service_port
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    path = "/health"
    port = local.email_service_port
  }
}

resource "aws_lb_target_group" "mailhog_http" {
  name        = "${local.environment}-mailhog-http"
  port        = local.mailhog_port_http
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    path = "/"
    port = local.mailhog_port_http
  }
}

resource "aws_lb_listener" "email_service_listener" {
  load_balancer_arn = aws_lb.app.id
  port              = local.email_service_port
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_lb_target_group.email_service.id
    type             = "forward"
  }
}

resource "aws_lb_listener" "mailhog_listener_http" {
  load_balancer_arn = aws_lb.app.id
  port              = local.mailhog_port_http
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_lb_target_group.mailhog_http.id
    type             = "forward"
  }
}
