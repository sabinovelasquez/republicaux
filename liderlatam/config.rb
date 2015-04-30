# config.rb
require 'uglifier'

set :css_dir, 'css'
set :js_dir, 'js'
set :images_dir, 'img'
set :partials_dir, 'partial'
set :haml, { :ugly => true, :format => :html5 }
#set :js_compressor, Uglifier.new(:mangle => false)
#set :js_compressor, Uglifier.new(:toplevel => true, :unsafe => true)
activate :minify_html
activate :livereload
activate :asset_hash
activate :cache_buster

configure :development do
  set :debug_assets, true
end

configure :build do
  activate :minify_javascript
  activate :minify_css
  activate :relative_assets
end

case ENV['TARGET'].to_s.downcase
  when 'production'
    activate :deploy do |deploy|
    deploy.method   = :ftp
    deploy.host     = 'ftp.techo.org'
    deploy.path     = '/'
    deploy.user     = 'lidereslatam@techo.org'
    deploy.password = 'difonia22'
    deploy.build_before = true
    end
  else
    activate :deploy do |deploy|
        deploy.method = :git
      deploy.branch   = 'bb-middleman'
      deploy.commit_message = 'Commit - middleman branch'
    end
  end