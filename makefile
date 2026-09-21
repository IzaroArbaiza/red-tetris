NAME = tetris

NODE_VERSION = 22.14.0
NODE_DIR = $(CURDIR)/node
NODE = $(NODE_DIR)/bin/node
NPM = $(NODE_DIR)/bin/npm

CLIENT = client
SERVER = server

UNAME_S = $(shell uname -s)
UNAME_M = $(shell uname -m)

ifeq ($(UNAME_S),Linux)
	ifeq ($(UNAME_M),x86_64)
		NODE_OS = linux
		NODE_ARCH = x64
	else ifeq ($(UNAME_M),aarch64)
		NODE_OS = linux
		NODE_ARCH = arm64
	else
		$(error Unsupported architecture: $(UNAME_M))
	endif
else
	$(error Unsupported operating system: $(UNAME_S))
endif

NODE_PACKAGE = node-v$(NODE_VERSION)-$(NODE_OS)-$(NODE_ARCH).tar.xz
NODE_URL = https://nodejs.org/dist/v$(NODE_VERSION)/$(NODE_PACKAGE)

.PHONY: all build clean fclean re

all: build

build:
	@if [ ! -x "$(NODE)" ]; then \
		echo "Installing Node.js $(NODE_VERSION)..."; \
		mkdir -p "$(NODE_DIR)"; \
		curl -fL "$(NODE_URL)" -o "/tmp/$(NODE_PACKAGE)"; \
		tar -xJf "/tmp/$(NODE_PACKAGE)" -C "$(NODE_DIR)" --strip-components=1; \
		rm -f "/tmp/$(NODE_PACKAGE)"; \
	fi
	@if [ ! -d "$(CLIENT)/node_modules" ]; then \
		echo "Installing client dependencies..."; \
		PATH="$(NODE_DIR)/bin:$$PATH" "$(NODE)" "$(NPM)" install --prefix "$(CLIENT)"; \
	fi
	@if [ ! -d "$(SERVER)/node_modules" ]; then \
		echo "Installing server dependencies..."; \
		PATH="$(NODE_DIR)/bin:$$PATH" "$(NODE)" "$(NPM)" install --prefix "$(SERVER)"; \
	fi
	@echo "Starting project..."
	@PATH="$(NODE_DIR)/bin:$$PATH" "$(NODE)" "$(NPM)" run dev --prefix "$(SERVER)" & \
	PATH="$(NODE_DIR)/bin:$$PATH" "$(NODE)" "$(NPM)" run dev --prefix "$(CLIENT)" -- --host 0.0.0.0

clean:
	@rm -rf "$(CLIENT)/dist"

fclean: clean
	@git clean -fdX

re: fclean build