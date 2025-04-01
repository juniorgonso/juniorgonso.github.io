# generate_gemfile.rb
content = File.read("Gemfile.builder")
File.write("Gemfile", content)
puts "Gemfile criado com sucesso!"
