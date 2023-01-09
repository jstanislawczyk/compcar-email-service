locals {
  region      = "us-east-1"
  environment = "jstanislawczyk"
  service     = "email-service"

  email_service_port = 3002
  mailhog_port_smtp = 1025
  mailhog_port_http = 8025
}
