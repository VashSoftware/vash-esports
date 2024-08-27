terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.63.1"
    }
  }
}

provider "aws" {
  # Configuration options
}

terraform {
  backend "s3" {
    bucket = ""

  }
}
