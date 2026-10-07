cask "onhand" do
  version "1.1.0"
  sha256 "f942d8ec1db23e4ae1f05f8b240de0b428f003b30d3be84b33ee6921323b4756"

  url "https://github.com/coreyhaines31/onhand/releases/download/v#{version}/OnHand-#{version}.zip"
  name "On Hand"
  desc "Clipboard history manager that keeps your clips local"
  homepage "https://onhandformac.com/"

  livecheck do
    url :url
    strategy :github_latest
  end

  auto_updates true
  depends_on macos: :sonoma

  app "On Hand.app"

  zap trash: [
    "~/Library/Application Support/OnHand",
    "~/Library/Preferences/com.onhandformac.OnHand.plist",
  ]
end
