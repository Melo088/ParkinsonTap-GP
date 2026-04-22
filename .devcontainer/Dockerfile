# .devcontainer/Dockerfile
FROM amazoncorretto:17-al2023

RUN yum install -y --allowerasing \
    git \
    curl \
    wget \
    unzip \
    tar \
    bash \
    findutils \
    && yum clean all

# Node.js 18 via nvm
ENV NVM_DIR=/root/.nvm
ENV NODE_VERSION=20

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash \
    && . "$NVM_DIR/nvm.sh" \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV PATH="$NVM_DIR/versions/node/v18.20.4/bin:$PATH"

# Maven
ENV MAVEN_VERSION=3.9.9
RUN curl -fsSL https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/${MAVEN_VERSION}/apache-maven-${MAVEN_VERSION}-bin.tar.gz \
    | tar -xz -C /opt \
    && ln -s /opt/apache-maven-${MAVEN_VERSION}/bin/mvn /usr/local/bin/mvn

RUN bash -c 'export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && java -version && mvn -version && node -v && npm -v'

# Esto asegura que nvm se cargue en cada terminal nueva
RUN echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc \
    && echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc

WORKDIR /workspace
