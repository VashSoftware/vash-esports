FROM openjdk:21-slim

WORKDIR /minecraft

# Install necessary tools
RUN apt-get update && apt-get install -y curl

# Set environment variables
ENV PAPER_VERSION=1.21.1
ENV PAPER_BUILD=57
ENV MEMORY=1G

# Download PaperMC server
RUN curl -o paper.jar https://api.papermc.io/v2/projects/paper/versions/${PAPER_VERSION}/builds/${PAPER_BUILD}/downloads/paper-${PAPER_VERSION}-${PAPER_BUILD}.jar

# Create a directory for plugins
RUN mkdir plugins

# Copy server configuration files (if any)
# COPY server.properties .
# COPY bukkit.yml .
# COPY spigot.yml .

# Expose the Minecraft server port
EXPOSE 25565

# Automatically agree to the Minecraft EULA
RUN echo "eula=true" > eula.txt

# Start the Minecraft server
CMD java -Xms${MEMORY} -Xmx${MEMORY} -jar paper.jar nogui