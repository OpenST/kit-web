class Web::EconomyController < Web::BaseController

  layout "economy"

  before_action :check_if_client_is_supported
  before_action :set_page_meta_info

  before_action :redirect_to_login_if_login_cookie_not_present

  after_action :remove_browser_caching


  # Economy dashboard
  #
  # * Author: Sunil
  # * Date: 01/03/2019
  # * Reviewed By: Puneet
  #
  def dashboard

    @response = CompanyApi::Request::Token.new(
        CompanyApi::Response::Formatter::Token,
        request.cookies,
        {"User-Agent" => http_user_agent}
    ).dashboard()

    unless @response.success?
      return handle_temporary_redirects(@response)
    end

    @presenter_obj = ::WebPresenter::TokenPresenter.new(@response, params)
  end

  # Planner to perform economy setup step one
  #
  # * Author: Ankit
  # * Date: 03/01/2019
  # * Reviewed By: Kedar
  #
  def token_setup

    @response = CompanyApi::Request::Token.new(
      CompanyApi::Response::Formatter::Token,
      request.cookies,
      {"User-Agent" => http_user_agent}
    ).fetch_token_details()

    unless @response.success?
      return handle_temporary_redirects(@response)
    end

    @presenter_obj = ::WebPresenter::TokenPresenter.new(@response, params)

  end

  # Start Token Deploy
  #
  # * Author: Ankit
  # * Date: 03/01/2019
  # * Reviewed By: Kedar
  #
  def token_deploy

    @response = CompanyApi::Request::Token.new(
      CompanyApi::Response::Formatter::Token,
      request.cookies,
      {"User-Agent" => http_user_agent}
    ).token_deploy()

    unless @response.success?
      return handle_temporary_redirects(@response)
    end

    @presenter_obj = ::WebPresenter::TokenPresenter.new(@response, params)

  end

  # Mint Tokens
  #
  # * Author: Ankit
  # * Date: 03/01/2019
  # * Reviewed By: Kedar
  #
  def token_mint

    @response = CompanyApi::Request::MintBt.new(
        CompanyApi::Response::Formatter::Token,
        request.cookies,
        {"User-Agent" => http_user_agent}
    ).mint()

    unless @response.success?
      return handle_temporary_redirects(@response)
    end

    @presenter_obj = ::WebPresenter::TokenPresenter.new(@response, params)

  end

  # Token Mint Progress
  #
  # * Author: Ankit
  # * Date: 03/01/2019
  # * Reviewed By: Kedar
  #
  def token_mint_progress

    @response = CompanyApi::Request::MintBt.new(
        CompanyApi::Response::Formatter::Token,
        request.cookies,
        {"User-Agent" => http_user_agent}
    ).mint_progress()

    unless @response.success?
      return handle_temporary_redirects(@response)
    end

    @presenter_obj = ::WebPresenter::TokenPresenter.new(@response, params)

  end

end
