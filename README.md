# Vash Esports

Vash Esports is a comprehensive platform designed for hosting esports tournaments and facilitating matchmaking across multiple games. Originally focused on **osu!**, the platform is expanding to include popular titles such as **PUBG**, **CS:GO**, and **Minecraft**, providing a seamless and scalable experience for gamers and organizers alike.

## Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Deployment](#deployment)
- [Data Engineering and Data Science](#data-engineering-and-data-science)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Tournament Hosting & Management**
  - Create, schedule, and manage esports tournaments with ease.
  - Automated bracket generation and real-time updates.
  
- **Advanced Matchmaking**
  - Intelligent matchmaking algorithms to pair players based on skill levels and preferences.
  - Support for multiple game modes and custom matchmaking rules.
  
- **User-Friendly Web Application**
  - Intuitive interface for tournament organizers and participants.
  - Real-time notifications and updates.
  
- **Scalable Infrastructure**
  - Designed to handle high traffic and large-scale tournaments across various games.
  
- **Comprehensive Analytics**
  - Detailed insights into tournament performance, player statistics, and engagement metrics.

## Architecture Overview

Vash Esports employs a modern, scalable architecture to ensure high performance and reliability. The system is divided into several key components:

- **Frontend**: Built with **SvelteKit** and **TypeScript**, providing a responsive and dynamic user experience.
- **Backend**: Developed using **Node.js** and **Go**, handling business logic, API services, and real-time operations.
- **Database**: Leveraging **Supabase** for scalable and reliable data storage.
- **Data Engineering**: Incorporates a **Data Warehouse** and **ETL Processes** for robust data collection and analysis.
- **Deployment**: Initially deployed using **Docker Compose** on a home server, with plans to migrate to **Kubernetes** and **Terraform** for enhanced scalability and infrastructure management.
- **CI/CD**: Automated pipelines using **GitHub Actions** to ensure seamless deployments and integrations.
- **Reverse Proxy**: Utilizing **Traefik** for efficient routing and HTTPS termination.

![Architecture Diagram](https://structurizr.com/share/YOUR_WORKSPACE_ID/SystemContext.png)

*Figure: High-level architecture diagram of Vash Esports.*

## Tech Stack

### **Frontend**
- **Framework**: SvelteKit
- **Language**: TypeScript
- **Styling**: Tailwind CSS

### **Backend**
- **Languages**: Node.js, Go
- **Frameworks**: Express.js (Node.js), Gin (Go)
- **API Design**: RESTful APIs, GraphQL

### **Database**
- **Primary Database**: Supabase (PostgreSQL)
- **Caching**: Redis

### **Data Engineering & Data Science**
- **Data Warehouse**: PostgreSQL / ClickHouse
- **ETL Tools**: Apache Airflow, dbt
- **Data Visualization**: Grafana, Metabase

### **Deployment & Infrastructure**
- **Containerization**: Docker, Docker Compose
- **Orchestration**: Docker Swarm (current), Kubernetes (future)
- **Infrastructure as Code**: Terraform
- **Reverse Proxy**: Traefik
- **CI/CD**: GitHub Actions

### **Other Tools**
- **Version Control**: Git, GitHub
- **Monitoring**: Prometheus, Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)

## Setup

### **Prerequisites**
- **Git**: Ensure Git is installed on your machine.
- **Docker & Docker Compose**: Install [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/).
- **Node.js & Go**: Install [Node.js](https://nodejs.org/) and [Go](https://golang.org/dl/).

### **1. Clone the Repository**

```bash
git clone https://github.com/VashSoftware/vash-esports.git
cd vash-esports
```

### **2. Configure Environment Variables**

Rename the `.env.example` file to `.env` and populate it with the necessary environment variables.

```bash
cp .env.example .env
```

Edit the `.env` file to include your configuration details:

```env
# Frontend Configuration
FRONTEND_API_URL=http://localhost:3000/api

# Backend Configuration
BACKEND_PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/vash_esports

# Supabase Configuration
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_KEY=your-supabase-key

# Data Engineering Configuration
DATA_WAREHOUSE_URL=postgresql://user:password@localhost:5433/data_warehouse
ETL_SCHEDULER_URL=http://localhost:8080

# Traefik Configuration
TRAEFIK_API=true
TRAEFIK_DASHBOARD=true
```

### **3. Build and Run the Services**

Ensure Docker and Docker Compose are installed. Execute the following command to build and start all services:

```bash
docker compose up -d
```

### **4. Access the Application**

- **Web App**: [http://localhost:5173](http://localhost:5173)
- **Supabase Studio**: [http://localhost:54321](http://localhost:54321)
- **Traefik Dashboard**: [https://traefik.vash.software:8090](https://traefik.vash.software:8090)

*Note: You may need to configure your hosts file and SSL certificates for HTTPS access in a development environment.*

## Deployment

Vash Esports is currently deployed on a home server using **Docker Compose**. The deployment setup includes:

- **Reverse Proxy**: Traefik manages routing and HTTPS termination.
- **Scalability**: Services are containerized for easy scaling and management.

### **Future Deployment Plans**

To enhance scalability and maintainability, future deployments will incorporate:

- **Kubernetes**: For advanced container orchestration, enabling automated scaling, self-healing, and efficient resource management.
- **Terraform**: For infrastructure as code, facilitating consistent and reproducible deployments across cloud environments.
- **Cloud Migration**: Transitioning to cloud platforms (e.g., AWS, GCP, Azure) to leverage managed services, improved reliability, and global scalability.

## Data Engineering and Data Science

Integrating data engineering and data science capabilities into Vash Esports allows for comprehensive data collection, processing, and analysis. This enables data-driven decision-making and enhances the overall user experience.

### **1. Data Warehouse**

A dedicated data warehouse serves as the central repository for all collected data, optimized for analytics and reporting.

- **Technology**: PostgreSQL / ClickHouse
- **Purpose**: Store structured data from various sources for analysis.

### **2. ETL Processes**

Extract, Transform, Load (ETL) pipelines automate the flow of data from source systems to the data warehouse.

- **Tools**: Apache Airflow, dbt
- **Functionality**:
  - **Extraction**: Collect data from APIs, databases, and user interactions.
  - **Transformation**: Cleanse and process data to ensure quality and consistency.
  - **Loading**: Insert transformed data into the data warehouse.

### **3. Data Visualization and BI**

Transform raw data into actionable insights through visualization tools and business intelligence dashboards.

- **Tools**: Grafana, Metabase
- **Use Cases**:
  - Monitor tournament statistics and player performance.
  - Analyze user engagement and platform usage.
  - Generate reports for stakeholders.

### **4. Data Science Initiatives**

Leverage machine learning and statistical analysis to enhance matchmaking algorithms, predict tournament outcomes, and personalize user experiences.

- **Languages**: Python, R
- **Libraries**: scikit-learn, TensorFlow, pandas

## Contributing

Contributions are highly encouraged and welcomed! Whether you're fixing bugs, improving documentation, or adding new features, your input is valuable to the Vash Esports community.

### **Guidelines**

1. **Fork the Repository**
2. **Create a New Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Commit Your Changes**

   ```bash
   git commit -m "Add feature: your feature description"
   ```

4. **Push to Your Fork**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Submit a Pull Request**

   - Ensure your PR description clearly outlines the changes and the reasons behind them.
   - Follow the project's coding standards and best practices.

### **Code of Conduct**

Please adhere to the [Code of Conduct](CODE_OF_CONDUCT.md) to maintain a respectful and collaborative environment.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any questions, feedback, or inquiries, please reach out via the following channels:

- **Discord**: [Join our Discord Server](https://discord.gg/n3mZgWk)
- **Email**: [stan@vash.software](mailto:stan@vash.software)
