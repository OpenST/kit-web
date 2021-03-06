# frozen_string_literal: true
module GlobalConstant

  class Workflow

    class << self

      def in_progress
        'inProgress'
      end

      def completed
        'completed'
      end

      def failed
        'failed'
      end

      def completely_failed
        'completelyFailed'
      end

    end

  end

end