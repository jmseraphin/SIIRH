import boto3
from botocore.exceptions import NoCredentialsError
import os

# ⚡ Configuration S3
S3_BUCKET = "nom-de-votre-bucket"
S3_REGION = "us-east-1"  # ohatra
S3_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
S3_SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

s3_client = boto3.client(
    "s3",
    region_name=S3_REGION,
    aws_access_key_id=S3_ACCESS_KEY,
    aws_secret_access_key=S3_SECRET_KEY
)

def upload_file_to_s3(file_path: str, s3_key: str) -> str:
    """
    Upload file to S3 and return the file URL
    """
    try:
        s3_client.upload_file(file_path, S3_BUCKET, s3_key)
        url = f"https://{S3_BUCKET}.s3.{S3_REGION}.amazonaws.com/{s3_key}"
        return url
    except NoCredentialsError:
        raise Exception("AWS credentials not found")
