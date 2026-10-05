// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "OnHandCore",
    platforms: [.macOS(.v14)],
    products: [.library(name: "OnHandCore", targets: ["OnHandCore"])],
    targets: [
        .systemLibrary(name: "CSQLite"),
        .target(name: "OnHandCore", dependencies: ["CSQLite"]),
        .testTarget(name: "OnHandCoreTests", dependencies: ["OnHandCore"])
    ]
)
