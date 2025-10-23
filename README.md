# Bookstore Application 📚

A modern, full-stack bookstore application built with Angular 20 and .NET Core 8.0. This application provides a complete e-commerce solution for browsing, searching, and purchasing books with comprehensive SEO optimization, responsive design, and progressive web app capabilities.

![Angular](https://img.shields.io/badge/Angular-20.3.5-red.svg)
![.NET Core](https://img.shields.io/badge/.NET%20Core-8.0-blue.svg)
![Entity Framework](https://img.shields.io/badge/Entity%20Framework-8.0-green.svg)
![SQL Server](https://img.shields.io/badge/SQL%20Server-2022-blue.svg)

## 🌟 Features

### Frontend Features (Angular 20)
- **Server-Side Rendering (SSR)** for optimal SEO performance
- **Progressive Web App (PWA)** with offline capabilities
- **Responsive Design** with modern UI/UX
- **Advanced Search & Filtering** for books
- **Shopping Cart** functionality
- **Real-time Notifications** with custom alert system
- **Comprehensive SEO** with dynamic meta tags and structured data
- **Custom Favicons** and social media integration

### Backend Features (.NET Core 8.0)
- **RESTful API** with clean architecture
- **Entity Framework Core** with SQL Server
- **Repository Pattern** for data access
- **AutoMapper** for object mapping
- **Swagger Documentation** for API exploration
- **Unit Testing** with xUnit and Moq
- **Fluent API** for database configuration

## 🏗️ Architecture

This application follows a **3-layer architecture** in the backend and **component-based architecture** in the frontend:

```
📁 Project Structure
├── 📁 Bookstore Angular/          # Frontend Application
│   ├── 📁 src/                    # Angular source code
│   ├── 📁 public/                 # Static assets (favicons, etc.)
│   └── 📄 README.md              # Frontend documentation
├── 📁 BookStore .Net/            # Backend Application
│   ├── 📁 src/
│   │   ├── 📁 BookStore.API/     # API layer (Controllers, DTOs)
│   │   ├── 📁 BookStore.Domain/  # Domain layer (Models, Services)
│   │   └── 📁 BookStore.Infrastructure/ # Infrastructure (Repositories, EF)
│   └── 📄 README.md              # Backend documentation
└── 📄 README.md                  # This file (Project overview)
```

### Backend Architecture
- **API Layer**: RESTful controllers and DTOs
- **Domain Layer**: Business logic, models, and services
- **Infrastructure Layer**: Data access via Repository pattern and Entity Framework

### Frontend Architecture
- **Standalone Components** (Angular 20 approach)
- **Service-based Architecture** for state management
- **Custom Services** for notifications, confirmations, and SEO

## 🛠️ Tech Stack

### Frontend
- **Angular 20.3.5** - Modern Angular with standalone components
- **Angular SSR** - Server-side rendering for SEO
- **TypeScript 5.9** - Type-safe development
- **RxJS 7.8** - Reactive programming
- **Angular Material** - UI component library
- **PWA Support** - Progressive web app capabilities

### Backend
- **.NET Core 8.0** - Cross-platform framework
- **Entity Framework Core 8.0** - ORM for database operations
- **SQL Server 2022** - Relational database
- **AutoMapper** - Object-to-object mapping
- **Swagger/OpenAPI** - API documentation
- **xUnit & Moq** - Unit testing framework

### Development Tools
- **Visual Studio 2022** - IDE for .NET development
- **Visual Studio Code** - IDE for Angular development
- **Node.js & npm** - JavaScript runtime and package manager
- **Angular CLI** - Angular development tools

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher) and **npm**
- **.NET SDK 8.0** or higher
- **SQL Server** (LocalDB, Express, or full edition)
- **Git** for version control

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd bookstore-angular-project
```

### 2. Backend Setup (.NET)

Navigate to the .NET project directory:
```bash
cd "BookStore .Net"
```

#### Install Dependencies
```bash
# Restore NuGet packages
dotnet restore BookStore.sln

# Or restore specific project
dotnet restore src/BookStore.API/BookStore.API.csproj
```

#### Database Setup
```bash
# Navigate to API project
cd src/BookStore.API

# Run database migrations (if using Entity Framework migrations)
dotnet ef database update

# Or create initial migration if needed
dotnet ef migrations add InitialCreate
dotnet ef database update
```

#### Run Backend
```bash
# From BookStore .Net directory
dotnet run --project src/BookStore.API/BookStore.API.csproj

# Or use Visual Studio: Open BookStore.sln and run BookStore.API project
```

The API will be available at: `https://localhost:5001` or `http://localhost:5000`

**Swagger Documentation**: Visit `https://localhost:5001/swagger` to explore API endpoints.

### 3. Frontend Setup (Angular)

Open a new terminal and navigate to the Angular project:
```bash
cd "Bookstore Angular"
```

#### Install Dependencies
```bash
npm install
```

#### Start Development Server
```bash
npm start
# or
ng serve
```

The application will be available at: `http://localhost:4200`

#### Start Production Server (with SSR)
```bash
npm run serve:ssr:bookstore
```

### 4. Verify Setup
1. **Backend**: Check `https://localhost:5001/swagger` - you should see API documentation
2. **Frontend**: Visit `http://localhost:4200` - you should see the bookstore application
3. **Database**: Ensure the API can connect to your SQL Server instance

## 🔧 Development Workflow

### Running Both Applications
For full-stack development, run both applications simultaneously:

1. **Terminal 1** (Backend):
   ```bash
   cd "BookStore .Net"
   dotnet run --project src/BookStore.API/BookStore.API.csproj
   ```

2. **Terminal 2** (Frontend):
   ```bash
   cd "Bookstore Angular"
   npm start
   ```

### API Integration
The Angular application communicates with the .NET API. Ensure:
- API base URL is configured in Angular environment files
- CORS is enabled in the .NET API (if running on different ports)
- API endpoints match the expected routes in Angular services

## 📚 API Documentation

The backend provides a RESTful API with the following main endpoints:

### Books
- `GET /api/books` - Get all books with pagination and filtering
- `GET /api/books/{id}` - Get book by ID
- `POST /api/books` - Create new book (Admin)
- `PUT /api/books/{id}` - Update book (Admin)
- `DELETE /api/books/{id}` - Delete book (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}/books` - Get books by category

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/{id}` - Get order details

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

**Full API documentation**: Visit Swagger UI at `https://localhost:5001/swagger` when the backend is running.

## 🧪 Testing

### Backend Testing
```bash
# Run unit tests
cd "BookStore .Net"
dotnet test

# Run tests with coverage
dotnet test --collect:"XPlat Code Coverage"
```

### Frontend Testing
```bash
# Run unit tests
cd "Bookstore Angular"
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🔒 Configuration

### Database Configuration
Update connection string in `BookStore .Net/src/BookStore.API/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=BookStoreDB;Trusted_Connection=True;MultipleActiveResultSets=true"
  }
}
```

### Frontend Configuration
Update API base URL in `Bookstore Angular/src/environments/`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001/api'
};
```

## 🚀 Deployment

### Backend Deployment
1. **Publish the application**:
   ```bash
   cd "BookStore .Net"
   dotnet publish src/BookStore.API/BookStore.API.csproj -c Release -o publish
   ```

2. **Deploy to IIS**:
   - Copy published files to IIS directory
   - Configure application pool for .NET 8.0
   - Set up database connection string

3. **Deploy to Azure**:
   - Create Azure App Service
   - Configure deployment from GitHub
   - Set up Azure SQL Database

### Frontend Deployment
1. **Build for production**:
   ```bash
   cd "Bookstore Angular"
   npm run build
   ```

2. **Deploy build files**:
   - Upload `dist/bookstore` contents to web server
   - Configure server for SPA routing (if not using SSR)

3. **Deploy with SSR**:
   ```bash
   npm run build
   npm run serve:ssr:bookstore
   ```

### Docker Deployment
Create Docker files for containerized deployment:
```dockerfile
# Backend Dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "BookStore.API.dll"]
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Code Style
- **Backend**: Follow .NET Core coding standards
- **Frontend**: Follow Angular style guide
- **Commits**: Use conventional commit format

## 📖 Documentation

### Project-Specific Documentation
- **[Frontend README](./Bookstore%20Angular/README.md)** - Detailed Angular application documentation
- **[Backend README](./BookStore%20.Net/README.md)** - .NET API documentation
- **[API Documentation](./BookStore%20.Net/src/BookStore.API/swagger/)** - Interactive API documentation

### Architecture Documentation
- **Clean Architecture** principles in backend
- **Component-based architecture** in frontend
- **Repository Pattern** for data access
- **SOLID principles** throughout

## 🐛 Troubleshooting

### Common Issues

**Database Connection Issues**:
- Verify SQL Server is running
- Check connection string in `appsettings.json`
- Ensure user has appropriate permissions

**CORS Issues**:
- Configure CORS in `BookStore.API/Program.cs`
- Update allowed origins for frontend URL

**Build Issues**:
- Clear npm cache: `npm cache clean --force`
- Restore NuGet packages: `dotnet restore`
- Update Node.js and .NET SDK to latest versions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

For support and questions:
- **Issues**: Use GitHub Issues for bug reports
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: Check individual README files for detailed guides

---

**Happy coding! 🎉**

*This README provides a comprehensive overview of the Bookstore application. For detailed implementation details, please refer to the individual README files in each project directory.*
