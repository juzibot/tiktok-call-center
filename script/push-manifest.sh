#!/usr/bin/env bash
set -e

ECR_URL=789252305933.dkr.ecr.cn-northwest-1.amazonaws.com.cn
imageName=$IMAGE_NAME
IMAGE_TAG=$VERSION

DOCKER_IMAGE_FULL_NAME="${ECR_URL}/${imageName}:${IMAGE_TAG}"
DOCKER_X86_IMAGE_FULL_NAME="$DOCKER_IMAGE_FULL_NAME"-amd64
DOCKER_ARM_IMAGE_FULL_NAME="$DOCKER_IMAGE_FULL_NAME"-arm64

echo "docker manifest create ${DOCKER_IMAGE_FULL_NAME} ${DOCKER_ARM_IMAGE_FULL_NAME} ${DOCKER_X86_IMAGE_FULL_NAME}"
docker manifest create ${DOCKER_IMAGE_FULL_NAME} ${DOCKER_ARM_IMAGE_FULL_NAME} ${DOCKER_X86_IMAGE_FULL_NAME}


echo "docker manifest annotate ${DOCKER_IMAGE_FULL_NAME} ${DOCKER_X86_IMAGE_FULL_NAME} --os linux --arch amd64"
docker manifest annotate ${DOCKER_IMAGE_FULL_NAME} ${DOCKER_X86_IMAGE_FULL_NAME} --os linux --arch amd64
echo "docker manifest annotate ${DOCKER_IMAGE_FULL_NAME} ${DOCKER_ARM_IMAGE_FULL_NAME} --os linux --arch arm64"
docker manifest annotate ${DOCKER_IMAGE_FULL_NAME} ${DOCKER_ARM_IMAGE_FULL_NAME} --os linux --arch arm64

echo "docker manifest push ${DOCKER_IMAGE_FULL_NAME}"
docker manifest push ${DOCKER_IMAGE_FULL_NAME}

