SRC = $(shell find src -name '*.js')
BIN = $(SRC:src/%.js=bin/%.js)

bin: $(BIN)
bin/%.js: src/%.js
	mkdir -p $(@D)
	babel --stage 0 --ignore='node_modules/' $< -o $@
