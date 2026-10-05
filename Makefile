DEVELOPER_DIR = /Applications/Xcode.app/Contents/Developer
export DEVELOPER_DIR

.PHONY: test lint app run
test:
	swift test
lint:
	SOURCEKIT_TOOLCHAIN_PATH="$(DEVELOPER_DIR)/Toolchains/XcodeDefault.xctoolchain" swiftlint lint --strict
app:
	bash scripts/build.sh
run: app
	open "dist/On Hand.app"
