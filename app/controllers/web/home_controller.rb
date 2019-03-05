class Web::HomeController < Web::BaseController

  layout :resolve_layout

  before_action :set_page_meta_info

  # Kit Home page
  #
  # * Author: Puneet
  # * Date: 03/01/2019
  # * Reviewed By: Kedar
  #
  def index
  end

  # Unsupported client page
  #
  # * Author: Puneet
  # * Date: 03/01/2019
  # * Reviewed By: Kedar
  #
  def unsupported_client

  end

  # Service unavailable
  #
  # * Author: Puneet
  # * Date: 03/01/2019
  # * Reviewed By: Kedar
  #
  def service_unavailable

  end

  private

  # Decide dynamic layout
  #
  # * Author: Puneet
  # * Date: 03/01/2019
  # * Reviewed By: Kedar
  #
  def resolve_layout
    case action_name
    when "unsupported_client"
      "header_only"
    when "service_unavailable"
      "header_only"
    else
      "kit"
    end
  end

end
